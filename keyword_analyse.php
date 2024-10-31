<?php
/*
Plugin Name: SEO Live Keyword Monitor
Plugin URI: http://www.databecker.de
Description: Analyse der Keyword-Verteilung basierend auf den Wordpress-Tags
Version: 0.1
Author: Data Becker
Author URI: http://www.databecker.de
Update Server: http://www.databecker.de/download/keyword_analyse
Min WP Version: 1.5
*/

add_action('init', 'addKWA_JS');
add_action('add_meta_boxes', 'addKWAMetaBox');

function addKWAMetaBox() {
  add_meta_box('keyword_analyser','SEO Live Keyword Monitor','initKWA','post','side');
}

function initKWA() {
  global $post;
  $tags = get_the_tags();
  if($tags) {
    echo '<table id="kwaTable"><tr><th class="alignLeft">Keyword / Tag</th><th class="alignRight">Keyword-Ratio</th></tr>';
    $content = $post->post_content;
    $content .= " ".$post->post_title;
    
    // Post already saved -> analyse content
    if($post->ID) {
      $content = html_entity_decode($content);
      $words = preg_split("/[\s,\.\?\!\:\/]+/",strip_tags($content));
      $words = array_filter($words); // remove empty array entries (especially last one when text ends e.g. with a dot)
      $cnt_words = count($words);
      
      foreach($tags as $tag) echo '<tr><td class="alignLeft">'.$tag->name.'</td><td id="kwa-'.$tag->slug.'" class="alignRight">'.round(countWordInWordArray($tag->name,$words)/$cnt_words*100,2).' %</td></tr>';
    }
    echo '</table>';
    
    echo utf8_encode('<br />Ihnen gefällt das Plugin? Dann schauen Sie doch mal, was der <a href="http://www.seo-traffic-booster.de/" target="_blank">SEO Traffic Booster</a> noch alles für Sie tun kann.');
    
    echo '<script type="text/javascript">
    var kwa_tags = [';
    $js_tags = array();
    
    foreach($tags as $tag) $js_tags[] = '["'.$tag->name.'","'.$tag->slug.'"]';
    echo implode(",",$js_tags);
    echo '];</script>';
  } else echo utf8_encode("Derzeit sind noch keine Tags gespeichert. Bitte fügen Sie zuerst die Tags hinzu und klicken anschließend auf Speichern bzw. Aktualisieren.");
}

// count how often a word occurs in an array
function countWordInWordArray($word,$wordArr) {
  return substr_count(strtolower(implode(" ",$wordArr)),strtolower($word));
}

function addKWA_JS() {
  if(is_admin()) {
    wp_enqueue_script('kwa',WP_PLUGIN_URL . '/seo_live_keyword_monitor/kwa.js',array('jquery'));
    wp_enqueue_style('kwa',WP_PLUGIN_URL . '/seo_live_keyword_monitor/kwa.css');
  }
}

function addKWA_Options() {
  add_option('kwa_allow_link',false);
}

function deleteKWA_Options() {
  delete_option('kwa_allow_link');
}

function addKWA_Menu() {
  add_options_page('SEO Live Keyword Monitor', 'SEO Live Keyword Monitor', 'manage_options', __FILE__, 'showKWA_Options');
}

function showKWA_Options() {
  echo '<h2>SEO Live Keyword Monitor</h2>';
  if(isset($_POST['submit'])) {
    updateKWA_Options();
  }
  
  $kwa_link = get_option('kwa_allow_link');
  echo '<form method="post">
    <input type="checkbox" name="kwa_link" id="kwa_link"'.(($kwa_link)?' checked':'').' /><label for="kwa_link"> SEO Live Keyword Monitor bewerben</label><br />
    F&uuml;gt einen Link im Footer Ihres Blogs hinzu<br />
    <input type="submit" name="submit" value="Speichern" />
  </form>';
}

function updateKWA_Options() {
  update_option('kwa_allow_link',isset($_POST['kwa_link']));
  echo '<div id="message" class="updated fade">Einstellung erfolgreich gespeichert.</div>';
}

register_activation_hook(__FILE__,'addKWA_Options');
register_deactivation_hook(__FILE__,'deleteKWA_Options');

add_action('admin_menu','addKWA_Menu');


function add_footer_link() {
  $link_allowed = get_option('kwa_allow_link');
  if($link_allowed) echo '<div style="text-align:center">powered by <a href="http://www.seo-traffic-booster.de/" target="_blank" title="SEO Software">SEO Traffic Booster</a></div>';
}
add_action('wp_footer', 'add_footer_link');
?>
