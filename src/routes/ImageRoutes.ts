const expressImages = require('express')
const ImagesRouter = expressImages.Router();  
const fs = require('fs');
const path = require('path');

ImagesRouter.get('/produto/:productfolder/:codprod', async function (req, res, next) {
    const dirpath="/mnt/winthor_img";
	const product = req.params.codprod;
    const productfolder = req.params.productfolder;
    const obj={"product":product+'.jpg',"dirpath":dirpath}
    
    if (fs.existsSync(dirpath)){
        console.log("DIRETORIO DE IMAGENS EXISTENTE - ",dirpath );
        if(product){
            if (fs.existsSync(dirpath+'/'+productfolder)){
                console.log("DIRETORIO EXISTENTE - LENDO ",dirpath+'/'+productfolder );
                let files=fs.readdirSync(dirpath+'/'+productfolder);
                    if(files.length>0){
                        let extension=path.parse(files[0]).ext
                        let existFile=files.find(element => element ===  product+extension)
                        console.log(existFile)
                        res.sendFile(dirpath+"/"+productfolder+"/"+product+extension,function(err) {
                            if(err){
                                res.sendFile(path.join(path.resolve('../'),'/wint_api/src/default.jpg'))
                                next(err)
                                res.status(404)
                                console.log('erro ao carregar arquivo - ' + err)
                            }else {
                                res.status(200)
                                console.log('ARQUIVO CARREGADO COM SUCESSO')
                            }
                        })
                    }else{
                        console.log('NENHUM ARQUIVO ENCONTRADO!')
                    }
   
            }else{ 
                res.json({"ERROR":"PASTA DO PRODUTO NAO ENCONTRADA"})
                console.log("PASTA DO PRODUTO NAO ENCONTRADA")
                res.status(404)
            }
        }
        }else{
            console.log('DIRETORIO INEXISTENTE')
        }
    

});

//module.exports=ImagesRouter
export default ImagesRouter