import { useRouter } from 'next/router';

const Post = () => {
    const router = useRouter()
    const query = router.query

    return <p>Post: {JSON.stringify(query)}</p>
}

export default Post