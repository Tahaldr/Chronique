const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      Home
      <div className="flex gap-4">
        <a href="/signup">Signup</a>
        <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default Home;
