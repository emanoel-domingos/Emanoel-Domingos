<?php
/**
 * Arquivo principal do tema para carregar a aplicação React
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO e Meta Tags -->
    <title><?php wp_title( '|', true, 'right' ); ?><?php bloginfo( 'name' ); ?></title>
    
    <?php wp_head(); ?>

    <!-- Importações do seu projeto original -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet">
    
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: {
                red: '#D61F26',
                dark: '#111111',
                gold: '#C5A059',
                gray: '#F4F4F5',
                cream: '#FDFBF7'
              }
            },
            fontFamily: {
              sans: ['Poppins', 'sans-serif'],
              serif: ['Playfair Display', 'serif'],
              display: ['Cinzel', 'serif'],
            }
          }
        }
      }
    </script>
    <style>
      body { font-family: 'Poppins', sans-serif; }
      h1, h2, h3, h4, .font-serif { font-family: 'Playfair Display', serif; }
      .font-display { font-family: 'Cinzel', serif; }
      .scroll-smooth { scroll-behavior: smooth; }
      ::selection { background-color: #D61F26; color: white; }
    </style>
</head>
<body <?php body_class('bg-brand-cream text-brand-dark antialiased'); ?>>
    <div id="root"></div>

    <!-- Carregamento dos scripts do React -->
    <script type="importmap">
    {
      "imports": {
        "react/": "https://esm.sh/react@^19.2.4/",
        "react": "https://esm.sh/react@^19.2.4",
        "react-dom/": "https://esm.sh/react-dom@^19.2.4/",
        "lucide-react": "https://esm.sh/lucide-react@^0.564.0"
      }
    }
    </script>
    
    <!-- No WordPress, os caminhos precisam ser dinâmicos -->
    <script type="module" src="<?php echo get_template_directory_uri(); ?>/index.tsx"></script>

    <?php wp_footer(); ?>
</body>
</html>
