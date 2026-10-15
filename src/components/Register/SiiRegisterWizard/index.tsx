import { useEffect, useReducer, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth";
import Stage1SiiCredentials from "./Stage1SiiCredentials";
import Stage2Loading, { useChecklistProgress } from "./Stage2Loading";
import Stage3CompleteAccount from "./Stage3CompleteAccount";
import { initialWizardState, wizardReducer } from "./types";

function getSafeValidateError(error: unknown): string {
  const axiosError = error as {
    response?: { data?: { message?: string }; status?: number };
    message?: string;
  };
  const apiMessage = axiosError?.response?.data?.message;
  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }
  if (axiosError?.response?.status === 401 || axiosError?.response?.status === 403) {
    return "No pudimos validar tus credenciales del SII. Revisa tu RUT y contraseña.";
  }
  if (!axiosError?.response) {
    return "No pudimos conectar con el servidor. Intenta nuevamente.";
  }
  return "Ocurrió un error al validar tus credenciales del SII. Intenta nuevamente.";
}

/**
 * Multi-step Empresa registration wizard.
 * SII credentials live only in React state for the session — never persisted.
 */
const SiiRegisterWizard = () => {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const { validateSii } = useAuth();
  const requestIdRef = useRef(0);
  const checklistActive = state.step === 2;
  const completedCount = useChecklistProgress(checklistActive);

  useEffect(() => {
    return () => {
      dispatch({ type: "CLEAR_SENSITIVE" });
    };
  }, []);

  useEffect(() => {
    if (state.step === 3 && (!state.validatedData || !state.siiPassword)) {
      dispatch({ type: "BACK_TO_STEP_1" });
    }
  }, [state.step, state.validatedData, state.siiPassword]);

  useEffect(() => {
    if (state.step !== 2 || !state.siiRut || !state.siiPassword) return;

    const requestId = ++requestIdRef.current;
    const { siiRut, siiPassword } = state;

    void (async () => {
      try {
        const data = await validateSii({ rut: siiRut, password: siiPassword });
        if (requestId !== requestIdRef.current) return;
        dispatch({ type: "VALIDATION_SUCCESS", payload: data });
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        dispatch({
          type: "VALIDATION_ERROR",
          payload: getSafeValidateError(error),
        });
      }
    })();
    // Intentionally depend on step + credentials snapshot when entering stage 2.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- validate once per START_VALIDATION
  }, [state.step, state.siiRut, state.siiPassword]);

  if (state.step === 2) {
    return <Stage2Loading completedCount={completedCount} />;
  }

  if (state.step === 3 && state.validatedData && state.siiPassword) {
    return (
      <Stage3CompleteAccount
        validatedData={state.validatedData}
        siiPassword={state.siiPassword}
        onRegistered={() => dispatch({ type: "CLEAR_SENSITIVE" })}
      />
    );
  }

  return (
    <Stage1SiiCredentials
      initialRut={state.siiRut}
      errorMessage={state.validateError}
      onContinue={({ siiRut, siiPassword }) => {
        dispatch({
          type: "START_VALIDATION",
          payload: { siiRut, siiPassword },
        });
      }}
    />
  );
};

export default SiiRegisterWizard;
