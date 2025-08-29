const { useState } = React;

function LoginModal() {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Register form state
  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginData.username,    // map frontend "username" field to backend "email"
        password: loginData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // If backend returns a token (e.g. DRF authtoken)
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      alert("Login successful!");
      window.location.reload();
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    console.error("Login request failed:", err);
    alert("Something went wrong. Please try again.");
  }
};


  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registered successfully!");
      setIsLogin(true); // switch to login tab
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary rounded-pill px-4 fw-bold">
        Login / Register
      </button>

      {open && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 overflow-hidden shadow">
              
              {/* Header */}
              <div className="bg-primary text-white p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">{isLogin ? 'Welcome Back!' : 'Create an Account'}</h4>
                  <button className="btn-close btn-close-white" onClick={() => setOpen(false)}></button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 bg-white">
                {/* Login Form */}
                {isLogin ? (
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label">Email address</label>
                      <div className="input-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="name@example.com"
                          required
                          value={loginData.username}
                          onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        />
                        <span className="input-group-text">
                          <i className="bi bi-envelope"></i>
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter your password"
                          required
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                        <span className="input-group-text">
                          <i className="bi bi-eye"></i>
                        </span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <input type="checkbox" id="remember" className="form-check-input me-1" />
                        <label htmlFor="remember" className="form-check-label">Remember me</label>
                      </div>
                      <a href="#" className="text-decoration-none text-primary">Forgot password?</a>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-semibold">
                      Sign In
                    </button>

                    {/* Social Login */}
                    <div className="text-center mt-4 mb-2 text-muted">or continue with</div>
                    <div className="d-flex gap-2">
                      <a href="/accounts/google/login/" className="btn btn-light w-50 border">
                        <i className="bi bi-google me-1"></i> Google
                      </a>
                      <a href="/accounts/facebook/login/" className="btn btn-light w-50 border">
                        <i className="bi bi-facebook me-1"></i> Facebook
                      </a>
                    </div>

                    {/* Switch to Register */}
                    <div className="text-center mt-4">
                      <span>Don't have an account? </span>
                      <a
                        href="#"
                        className="text-decoration-none text-primary fw-semibold"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsLogin(false);
                        }}
                      >
                        Register now
                      </a>
                    </div>
                  </form>
                ) : (
                  // Register Form
                  <form onSubmit={handleRegister}>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input
                          className="form-control"
                          placeholder="First Name"
                          required
                          value={registerData.FirstName}
                          onChange={(e) => setRegisterData({ ...registerData, FirstName: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          className="form-control"
                          placeholder="Last Name"
                          required
                          value={registerData.LastName}
                          onChange={(e) => setRegisterData({ ...registerData, LastName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      />
                    </div>
                    <div className="mt-2">
                      <input
                        className="form-control"
                        type="tel"
                        placeholder="Phone Number"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      />
                    </div>
                    <div className="mt-2">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        required
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      />
                    </div>
                    <div className="mt-2">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={registerData.confirm_password}
                        onChange={(e) => setRegisterData({ ...registerData, confirm_password: e.target.value })}
                      />
                    </div>
                    <button className="btn btn-success w-100 py-2 mt-3 fw-bold" type="submit">
                      Register
                    </button>

                    {/* Social Register */}
                    <div className="text-center mt-4 mb-2 text-muted">or continue with</div>
                    <div className="d-flex gap-2">
                      <a href="/accounts/google/login/" className="btn btn-light w-50 border">
                        <i className="bi bi-google me-1"></i> Google
                      </a>
                      <a href="/accounts/facebook/login/" className="btn btn-light w-50 border">
                        <i className="bi bi-facebook me-1"></i> Facebook
                      </a>
                    </div>

                    {/* Switch back to Login */}
                    <div className="text-center mt-3">
                      <span>Already have an account? </span>
                      <a
                        href="#"
                        className="text-decoration-none text-primary fw-semibold"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsLogin(true);
                        }}
                      >
                        Login
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('login-modal-root'));
root.render(<LoginModal />);
