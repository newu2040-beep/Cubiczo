#!/bin/bash
cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Cubiczo - Your world, one link.</title>
  <!-- Google Fonts Preload -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,800&display=swap" rel="stylesheet" id="cubiczo-fonts">
  <style>
EOF
cat cubiczo.css >> index.html
cat << 'EOF' >> index.html
  </style>
</head>
<body>
EOF
cat cubiczo_html.html >> index.html
cat << 'EOF' >> index.html
  <script>
EOF
cat cubiczo_js.js >> index.html
cat << 'EOF' >> index.html
  </script>
</body>
</html>
EOF
