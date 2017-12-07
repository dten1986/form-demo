<?php
	$file = getcwd() . '/form-data.json';

	if ($_SERVER['QUERY_STRING'] && strrpos($_SERVER['QUERY_STRING'], 'submit') !== false) {
		
		$req = explode('=', $_SERVER['QUERY_STRING']);
		
		$data = urldecode($req[1]);
		
	//	if (!file_exists($file))
		file_put_contents($file, $data);
		
	//	print_r(file_exists($file));
		//echo 'req';
		echo '{"status": "OK","info": "Form data saved!", "data": ' . $data . '}';
	} else {
		if (!file_exists($file))
			file_put_contents($file, '{}');
		
		echo file_get_contents($file);
	}

?>