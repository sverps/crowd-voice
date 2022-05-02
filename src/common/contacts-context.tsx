import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import { useLocalStorage } from "./use-local-storage";
import * as contactsJson from "../data/contacts.json";

const contacts = Array.from(contactsJson);

type Contact = {
  id: string;
  url: string;
  committees: {
    committee: string;
    position: string;
  }[];
  firstName: string;
  lastName: string;
  email: string;
  group: string;
  country: string;
  party: string;
};

type Filter = {
  committees?: any;
  countries?: any;
  groups?: any;
};

const contextInit: {
  contacts: Contact[];
  filterState: [
    undefined | Filter,
    Dispatch<SetStateAction<undefined | Filter>>
  ];
} = {
  contacts,
  filterState: [undefined, () => {}],
};

const ContactsContext = React.createContext(contextInit);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const queryString = globalThis.location?.search ?? "";
  const queryParams = new URLSearchParams(queryString);
  const contactsFilterFromQuery = queryParams.get("contacts-filter");

  const filterState = useLocalStorage<undefined | Filter>(
    "contacts-filter",
    undefined,
    contactsFilterFromQuery
      ? JSON.parse(decodeURI(contactsFilterFromQuery))
      : undefined
  );

  useEffect(() => {
    const [filter] = filterState;
    queryParams.delete("contacts-filter");
    if (filter) {
      queryParams.append("contacts-filter", encodeURI(JSON.stringify(filter)));
    }
    if (queryString.substring(1) !== queryParams.toString()) {
      const newQueryString = queryParams.toString();
      window.history.replaceState(
        undefined,
        "",
        window.location.href.split("?")[0] +
          (newQueryString.length ? `?${newQueryString}` : "")
      );
    }
  }, [filterState]);

  const contextValue = useMemo(
    () => ({ ...contextInit, filterState }),
    [filterState]
  );

  return (
    <ContactsContext.Provider value={contextValue}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContactFilter = () => {
  const { filterState } = useContext(ContactsContext);
  return filterState;
};

export const useContacts = () => {
  const {
    contacts,
    filterState: [filter],
  } = useContext(ContactsContext);
  return contacts.filter((contact) => {
    if (!filter) {
      return true;
    }

    let matchingCommittee = true;
    if (filter.committees) {
      matchingCommittee = false;
      for (const { committee } of contact.committees) {
        if (filter.committees.includes(committee)) {
          matchingCommittee = true;
          break;
        }
      }
    }

    let matchingCountry = true;
    if (filter.countries && !filter.countries.includes(contact.country)) {
      matchingCommittee = false;
    }

    let matchingGroups = true;
    if (filter.groups && !filter.groups.includes(contact.group)) {
      matchingGroups = false;
    }

    if (matchingCommittee && matchingCountry && matchingGroups) {
      return true;
    }
    return false;
  });
};

const committeeOptions = new Set<string>();
const countryOptions = new Set<string>();
const groupOptions = new Set<string>();
contacts.forEach((contact) => {
  contact.committees.forEach(({ committee }) => {
    committeeOptions.add(committee);
  });
  countryOptions.add(contact.country);
  groupOptions.add(contact.group);
});

export const filterOptions = {
  committees: Array.from(committeeOptions).sort(),
  countries: Array.from(countryOptions).sort(),
  groups: Array.from(groupOptions).sort(),
};
