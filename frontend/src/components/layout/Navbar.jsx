function Navbar() {
  return (
    <div
  style={{
    height: "60px",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    background: "var(--layout-bg)",
    color: "var(--layout-text)",
    borderBottom: "1px solid var(--layout-border)",
  }}
>
  <h2 style={{ fontSize: "18px", fontWeight: 600 }}>
    Travel Recommender Dashboard
  </h2>
</div>

  );
}

export default Navbar;
