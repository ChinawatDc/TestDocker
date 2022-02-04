import Image from "next/image";
import bell from '../public/bell.jpg'

export const getStaticProps = async () => {
    // console.log(process.env.DB_HOST)
    return{
        props : {
            db_host: process.env.DB_HOST,
            db_user: process.env.DB_USER
        }
    }
}

function ToFuNB456({ db_host, db_user }){
    //const db= mysql.connect(db_host, db_user, db_password)
    return(
        <div>
            <h1> ToFuNB456 Page!! </h1>
            <p>db_host: {db_host}, db_user: {db_user}</p>
            <Image
                src={bell}
                alt="handsome boy"
            />
        </div>
    )
}

export default ToFuNB456;