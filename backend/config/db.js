const{Pool}=require ('pg');

const pool=new Pool({
    host:process.env.DB_HOST,
    port: process.env.DB_PORT,       // PostgreSQL portu (5432)
  database: process.env.DB_NAME,   // veritabanı adı
  user: process.env.DB_USER,       // kullanıcı adı
  password: process.env.DB_PASSWORD,
});
module.exports=pool;