const express = require('express')
const ImagesRouter = express.Router();  
//PROCESS IMAGES ROUTES
const fs = require('fs');
const path = require('path');
const url = require('url');
const Jimp = require('jimp');


ImagesRouter.get('/produto/codprod/:codprod', async function (req, res) {
    const caminho='/mnt/winthor_img'
    //console.log(caminho)
	const query = url.parse(req.url, true).query;
    //let file = req.params.codprod
	let file ='teste'
    let filePath = path.join(caminho, `/${file}`);

	if (!fs.existsSync(filePath)) {
		file = process.env.DEFAULT_IMAGE;
		filePath = path.join(caminho, `/${file}`);
	}

	const height = parseInt(query.h) || 0; // Get height from query string
	const width = parseInt(query.w) || 0; // Get width from query string
	const quality = parseInt(query.q) < 100 ? parseInt(query.q) : 99; // Get quality from query string

	const folder = `q${quality}_h${height}_w${width}`;
	const out_file = `public/thumb/${folder}/${file}`;
	if (fs.existsSync(path.resolve(out_file))) {
		res.sendFile(path.resolve(out_file));
		return;
	}

	// If no height or no width display original image
	if (!height || !width) {
		res.sendFile(path.resolve(`/${file}`));
		return;
	}

	// Use jimp to resize image
	Jimp.read(path.resolve(`/${file}`))
		.then(lenna => {

			lenna.resize(width, height); // resize
			lenna.quality(quality); // set JPEG quality

			lenna.write(path.resolve(out_file), () => {
				fs.createReadStream(path.resolve(out_file)).pipe(res);
			}); // save and display
		})
		.catch(err => {
			res.sendFile(path.resolve(`/${file}`));
		});


});

module.exports=ImagesRouter