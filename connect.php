<?php
  $host = "localhost";
  $username = "root";
  $password = "";
  $dbname = "form_db";

  //create connection
  $con = mysqli_connect($host, $username, $password, $dbname);

    if(isset($_POST['submit']))
    {
        $fname = $_POST['fname'];
		$lname = $_POST['lname'];
		$phn = $_POST['phn'];
        $email = $_POST['email'];
        $messag = $_POST['mesg'];
        
        //database details. You have created these details in the third step. Use your own.
      
        //check connection if it is working or not
        if (!$con)
        {
            die("Connection failed!".mysqli_connect_error());
        }
        //This below line is a code to Send form entries to database
        $sql = "INSERT INTO contactform (id, fname, lname, phn,  email, messag ) VALUES ('0', '$fname','$lname' ,'$phn','$email', '$messag')";
      //fire query to save entries and check it with if statement
        $rs = mysqli_query($con, $sql);
        if($rs)
        {
            echo "Successfully saved";
        }
      //connection closed.
        mysqli_close($con);
    }
?>