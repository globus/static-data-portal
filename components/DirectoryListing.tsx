import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { transfer } from "@globus/sdk";

import STATIC from "@/static.json";

export default function DirectoryListing() {
  const auth = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      if (!auth.user) {
        return;
      }
      const response = await transfer.fileOperations.ls(
        STATIC.globus.transfer.collection_id,
        {
          headers: {
            Authorization: `Bearer ${auth.user.access_token}`,
          },
        },
      );
      const data = await response.json();
      console.log(data);
      setItems([]);
    }
    fetchItems();
  }, [auth]);

  return (
    <div>
      <h1>Directory Listing</h1>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
