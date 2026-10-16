import type { ValidatedSiiData } from "../../../types/auth/validated-sii";

export type { ValidatedSiiData, ValidatedSiiEmpresa } from "../../../types/auth/validated-sii";

export type RegisterWizardStep = 1 | 2 | 3;

export interface SiiRegisterWizardState {
  step: RegisterWizardStep;
  /** Personal SII RUT. Kept in memory only for the wizard session. */
  siiRut: string;
  /**
   * Personal SII password. Held in React memory during the wizard, then sent
   * as password_sii_personal on register. Never put in localStorage,
   * sessionStorage, URL, or error logs on the client.
   */
  siiPassword: string;
  validatedData: ValidatedSiiData | null;
  validateError: string | null;
}

export type SiiRegisterWizardAction =
  | {
      type: "START_VALIDATION";
      payload: { siiRut: string; siiPassword: string };
    }
  | { type: "VALIDATION_SUCCESS"; payload: ValidatedSiiData }
  | { type: "VALIDATION_ERROR"; payload: string }
  | { type: "BACK_TO_STEP_1" }
  | { type: "CLEAR_SENSITIVE" };

export const initialWizardState: SiiRegisterWizardState = {
  step: 1,
  siiRut: "",
  siiPassword: "",
  validatedData: null,
  validateError: null,
};

export function wizardReducer(
  state: SiiRegisterWizardState,
  action: SiiRegisterWizardAction,
): SiiRegisterWizardState {
  switch (action.type) {
    case "START_VALIDATION":
      return {
        ...state,
        step: 2,
        siiRut: action.payload.siiRut,
        siiPassword: action.payload.siiPassword,
        validateError: null,
        validatedData: null,
      };
    case "VALIDATION_SUCCESS":
      return {
        ...state,
        step: 3,
        validatedData: action.payload,
        validateError: null,
        // Keep siiPassword in memory for "use same password" on stage 3.
      };
    case "VALIDATION_ERROR":
      return {
        ...state,
        step: 1,
        siiPassword: "",
        validatedData: null,
        validateError: action.payload,
      };
    case "BACK_TO_STEP_1":
      return {
        ...state,
        step: 1,
        siiPassword: "",
        validatedData: null,
        validateError: null,
      };
    case "CLEAR_SENSITIVE":
      return {
        ...state,
        siiPassword: "",
      };
    default:
      return state;
  }
}
