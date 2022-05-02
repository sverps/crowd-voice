import "../styles/globals.css";
import type { AppProps } from "next/app";
import { EmailTemplateProvider } from "../src/common/email-template-context";
import { ContactsProvider } from "../src/common/contacts-context";
import { ExclusionListProvider } from "../src/common/exclusion-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ExclusionListProvider>
      <ContactsProvider>
        <EmailTemplateProvider>
          <Component {...pageProps} />
        </EmailTemplateProvider>
      </ContactsProvider>
    </ExclusionListProvider>
  );
}

export default MyApp;
