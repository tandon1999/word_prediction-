<?php
$a=$_GET['TEXT'];
    // echo '<script>alert("Word added to the datasheet is ",$a);</script>';
// alert("word added");

// function alert($a) {
//     echo "<script type='text/javascript'>alert('$a');</script>";
// }

header("location: http://localhost/final_software/index.html");

function alert($a) {
    echo "<script type='text/javascript'>alert('$a');</script>";
}
alert("word added");
$textfile=fopen("words.txt","a");
$text=$a.PHP_EOL;  
fwrite($textfile, $text);
fclose($textfile);
?>