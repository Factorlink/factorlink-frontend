import RegisterForm from "../../../components/Register";
import { ROLES } from "../../../utils/consts";

const EmpresasRegister = () => {
  return (
    <RegisterForm
      roleType={ROLES.EMPRESA_ADMIN}
      tabLabel="Empresa"
    />
  );
};

export default EmpresasRegister;
