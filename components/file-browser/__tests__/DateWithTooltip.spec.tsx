import { test, expect } from "@jest/globals";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateWithTooltip } from "../DateWithTooltip";

test("displays formatted date and raw date on hover", async () => {
  const raw = "2023-04-23 21:02:53+00:00";
  const { getByText } = render(<DateWithTooltip value={raw} />);
  const date = getByText("Apr 23, 2023, 9:02 PM");
  expect(date).toBeVisible();
  await userEvent.hover(date);
  await waitFor(() => expect(getByText(raw)).toBeVisible());
});
