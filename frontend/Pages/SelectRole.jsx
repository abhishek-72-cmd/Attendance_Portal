import { useNavigate } from "react-router-dom";

function SelectRole() {
  const navigate = useNavigate();

  const handleRoleSelect = async (role) => {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/auth/set-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    // redirect after setting role
    if (role === "HR") navigate("/hr");
    else if (role === "MANAGER") navigate("/manager");
    else navigate("/employee");
  };

  return (
    <div>
      <h2>Select Your Role</h2>

      <button onClick={() => handleRoleSelect("EMPLOYEE")}>
        Employee
      </button>

      <button onClick={() => handleRoleSelect("MANAGER")}>
        Manager
      </button>

      <button onClick={() => handleRoleSelect("HR")}>
        HR
      </button>
    </div>
  );
}

export default SelectRole;