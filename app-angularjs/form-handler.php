<?php
	$file = getcwd() . '/form-data.json';
	if (!file_exists($file) || !filesize($file))
		file_put_contents($file, '[]');

	$file_content = file_get_contents($file);
	
	$data = json_decode(file_get_contents($file));

	if (gettype($data) == 'object') {
		$data =  array_values((array) $data);
		$file_content = json_encode($data);
		file_put_contents($file, $file_content);
	}
	
	if ($_SERVER['QUERY_STRING'] && strrpos($_SERVER['QUERY_STRING'], 'submit') !== false) {
		$req = explode('=', $_SERVER['QUERY_STRING']);
		$item = json_decode(urldecode($req[1]));
		
		if ($item->index == -1)
			$data[] = $item->item;
		else
			if (isset($item->item))
				$data[$item->index] = $item->item;
			else
				unset($data[$item->index]);
		
		$data = json_encode($data);
		file_put_contents($file, $data);
		echo '{"status": "OK","info": "Form data saved!"}';
	} else {
		echo $file_content;
	}

?>