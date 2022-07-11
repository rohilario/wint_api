import { DataSource } from "typeorm"

 const AppDataSource = new DataSource({
    type: "oracle",
    host: process.env.HOST,
    port: 1521,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.BD,
    sid:process.env.BD

})

AppDataSource
    .initialize()
    .then(() => {
        console.log("CONEXAO ORACLE TYPEORM INICIADA COM SUCESSO!!")
    })
    .catch((err) => {
        console.error("ERRO AO INICIAR A CONEXAO ORACLE COM TYPEORM: ", err)
    })

export default AppDataSource