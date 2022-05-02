import React, { Dispatch, SetStateAction, useContext } from "react";
import { useLocalStorage } from "./use-local-storage";

type EmailTemplate = {
  subject: string;
  body: string;
};

const emailTemplateInit: EmailTemplate = {
  subject: "",
  body: "",
};

const contextInit: [EmailTemplate, Dispatch<SetStateAction<EmailTemplate>>] = [
  emailTemplateInit,
  () => {},
];

const EmailTemplateContext = React.createContext(contextInit);

export const EmailTemplateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const storage = useLocalStorage("email-template", emailTemplateInit);

  return (
    <EmailTemplateContext.Provider value={storage}>
      {children}
    </EmailTemplateContext.Provider>
  );
};

export const useEmailTemplate = () => useContext(EmailTemplateContext);
