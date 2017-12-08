<?php
	$file = getcwd() . '/form-data.json';

	if ($_SERVER['QUERY_STRING'] && strrpos($_SERVER['QUERY_STRING'], 'submit') !== false) {
		$data = json_decode(file_get_contents($file));
		
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
		if (!file_exists($file) || !filesize($file))
			file_put_contents($file, '[]');
		
		echo file_get_contents($file);
	}

?>