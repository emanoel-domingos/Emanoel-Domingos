<?php
/**
 * Funções do tema
 */

function ed_vigna_setup() {
    // Adiciona suporte a título dinâmico
    add_theme_support( 'title-tag' );
    // Adiciona suporte a imagens destacadas
    add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'ed_vigna_setup' );

// Remove margem do topo da barra do admin para não quebrar o layout
add_action('get_header', function() {
    remove_action('wp_head', '_admin_bar_bump_cb');
});
