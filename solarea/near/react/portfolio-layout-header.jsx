const { useWallet } = solarea.nearContext;

add(() => {
  const wallet = useWallet();

  const { accountId } = wallet.account();

  return (
    <nav className="bu-navbar p-t-8 p-b-8" role="navigation" aria-label="main navigation"></nav>
  );
});
