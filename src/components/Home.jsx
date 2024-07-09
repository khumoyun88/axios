import Feed from './Feed';

const Home = ({ posts , loading }) => {
    return (
        <main className="Home">
            { loading ? <p>Loading...</p> : posts.length ? (
                <Feed posts={posts} />
            ) : (
                <p style={{ marginTop: "2rem" }}>
                    No posts to display.
                </p>
            )}
        </main>
    )
}

export default Home
