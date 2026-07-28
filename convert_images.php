<?php
ini_set('memory_limit', '2048M');

function convertImages($dir) {
    $files = glob($dir . '/*');
    foreach ($files as $file) {
        if (is_dir($file)) {
            convertImages($file);
        } else {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['png', 'jpg', 'jpeg'])) {
                $base = pathinfo($file, PATHINFO_DIRNAME) . '/' . pathinfo($file, PATHINFO_FILENAME);
                $webpPath = $base . '.webp';
                
                if (!file_exists($webpPath)) {
                    echo "Converting $file...\n";
                    $content = file_get_contents($file);
                    if ($content) {
                        $img = @imagecreatefromstring($content);
                        if ($img !== false) {
                            // Convert to webp with 80% quality
                            imagewebp($img, $webpPath, 80);
                            imagedestroy($img);
                            
                            if (file_exists($webpPath)) {
                                unlink($file); // remove original
                            }
                        } else {
                            echo "Failed to process image data in $file\n";
                        }
                    } else {
                        echo "Failed to read $file\n";
                    }
                }
            }
        }
    }
}

$start = microtime(true);
echo "Starting PHP image conversion to WebP...\n";
convertImages(__DIR__ . '/public/images');
echo "Done in " . round(microtime(true) - $start, 2) . " seconds.\n";
