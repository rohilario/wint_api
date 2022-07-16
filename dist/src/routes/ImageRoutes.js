"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const expressImages = require('express');
const ImagesRouter = expressImages.Router();
const functionsImages = require('../services/functions');
const fs = require('fs');
const path = require('path');
ImagesRouter.get('/produto/:productfolder/:codprod', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirpath = "/mnt/winthor_img";
        const product = req.params.codprod;
        const productfolder = req.params.productfolder;
        const obj = { "product": product + '.jpg', "dirpath": dirpath };
        if (fs.existsSync(dirpath)) {
            console.log("DIRETORIO DE IMAGENS EXISTENTE - ", dirpath);
            if (product) {
                if (fs.existsSync(dirpath + '/' + productfolder)) {
                    console.log("DIRETORIO EXISTENTE - LENDO ", dirpath + '/' + productfolder);
                    let files = fs.readdirSync(dirpath + '/' + productfolder);
                    if (files.length > 0) {
                        let extension = path.parse(files[0]).ext;
                        let existFile = files.find(element => element === product + extension);
                        console.log(existFile);
                        res.sendFile(dirpath + "/" + productfolder + "/" + product + extension, function (err) {
                            if (err) {
                                res.sendFile(path.join(path.resolve('../'), '/wint_api/src/default.jpg'));
                                next(err);
                                res.status(404);
                                console.log('erro ao carregar arquivo - ' + err);
                            }
                            else {
                                res.status(200);
                                console.log('ARQUIVO CARREGADO COM SUCESSO');
                            }
                        });
                    }
                    else {
                        console.log('NENHUM ARQUIVO ENCONTRADO!');
                    }
                }
                else {
                    res.json({ "ERROR": "PASTA DO PRODUTO NAO ENCONTRADA" });
                    console.log("PASTA DO PRODUTO NAO ENCONTRADA");
                    res.status(404);
                }
            }
        }
        else {
            console.log('DIRETORIO INEXISTENTE');
        }
    });
});
//module.exports=ImagesRouter
exports.default = ImagesRouter;
