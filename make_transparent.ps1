Add-Type -AssemblyName System.Drawing
$img1 = [System.Drawing.Bitmap]::FromFile('d:\RIR STUDIO\RIR STUDIO WEB\portfolio\public\images\logo-light.png')
$img1.MakeTransparent([System.Drawing.Color]::White)
$img1.Save('d:\RIR STUDIO\RIR STUDIO WEB\portfolio\public\images\logo-light-transparent.png', [System.Drawing.Imaging.ImageFormat]::Png)

$img2 = [System.Drawing.Bitmap]::FromFile('d:\RIR STUDIO\RIR STUDIO WEB\portfolio\public\images\logo-dark.png')
$img2.MakeTransparent([System.Drawing.Color]::Black)
$img2.Save('d:\RIR STUDIO\RIR STUDIO WEB\portfolio\public\images\logo-dark-transparent.png', [System.Drawing.Imaging.ImageFormat]::Png)
