import Link from 'next/link'

const Header = () => {
    return (
        <ul>
            <li>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </li>
            <li>
                <Link href="/tofunb456">
                    <a>ToFuNB456 Page</a>
                </Link>
            </li>
            <li>
                <Link href="/blog/hello-world">
                    <a>Blog Post</a>
                </Link>
            </li>
            <li>
                <Link href="/post/basic">
                    <a>Basic Dynmic Router: goto pages/post/[pid].js</a>
                </Link>
            </li>
            <li>
                <Link href="/post/param?foo=bar">
                    <a>Dynmic Router with param: goto pages/post/[pid].js</a>
                </Link>
            </li>
        </ul>
    )
}

export default Header