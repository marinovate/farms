/**
 * orderUtils.ts
 * Utilities for formatting and parsing customer and address details in orders.
 */

export interface OrderCustomerAddress {
  name: string;
  phone: string;
  street: string;
  cityVillage: string;
  state: string;
  zipCode: string;
  formattedAddress: string;
}

/**
 * Parses the raw address string stored in the database.
 * Supports:
 * 1. JSON serialized payloads: { name, phone, street, cityVillage, state, zipCode, formattedAddress }
 * 2. Formatted text strings (e.g. "Name: ... | Phone: ... | Address: ...")
 * 3. Legacy plain address strings (with fallback to profile data)
 */
export function parseOrderCustomerAddress(
  rawAddress: string | null | undefined,
  fallbackProfile?: { full_name?: string | null } | null
): OrderCustomerAddress {
  const defaultName = fallbackProfile?.full_name?.trim() || "Valued Customer";
  const defaultPhone = "Not Provided";

  if (!rawAddress || !rawAddress.trim()) {
    return {
      name: defaultName,
      phone: defaultPhone,
      street: "",
      cityVillage: "",
      state: "",
      zipCode: "",
      formattedAddress: "Address not specified",
    };
  }

  const trimmed = rawAddress.trim();

  // 1. Try parsing JSON format
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      const name = (parsed.name || parsed.fullName || parsed.customerName || defaultName).trim();
      const phone = (parsed.phone || parsed.phoneNumber || parsed.contact || defaultPhone).trim();
      const street = (parsed.street || parsed.streetAddress || "").trim();
      const cityVillage = (parsed.cityVillage || parsed.city || parsed.village || "").trim();
      const state = (parsed.state || "").trim();
      const zipCode = (parsed.zipCode || parsed.zip || parsed.pincode || "").trim();

      const calculatedFullAddress = [street, cityVillage, state, zipCode].filter(Boolean).join(", ");
      const formattedAddress = parsed.formattedAddress?.trim() || calculatedFullAddress || trimmed;

      return {
        name: name || defaultName,
        phone: phone || defaultPhone,
        street,
        cityVillage,
        state,
        zipCode,
        formattedAddress,
      };
    } catch {
      // Proceed to regex / text parsing if JSON parsing fails
    }
  }

  // 2. Try parsing structured text with "Name:", "Phone:", "Address:" labels
  let extractedName = "";
  let extractedPhone = "";
  let addressBody = trimmed;

  const nameMatch = trimmed.match(/(?:Name|Customer|Full Name):\s*([^|\n,;]+)/i);
  if (nameMatch) {
    extractedName = nameMatch[1].trim();
  }

  const phoneMatch = trimmed.match(/(?:Phone|Contact|Mobile|Tel|Number):\s*([^|\n,;]+)/i);
  if (phoneMatch) {
    extractedPhone = phoneMatch[1].trim();
  }

  const addrMatch = trimmed.match(/(?:Address|Delivery Address|Location):\s*([^|\n]+)/i);
  if (addrMatch) {
    addressBody = addrMatch[1].trim();
  } else if (nameMatch || phoneMatch) {
    // Strip out name and phone labels from addressBody
    addressBody = trimmed
      .replace(/(?:Name|Customer|Full Name):\s*[^|\n,;]+[|\n,;]?/gi, "")
      .replace(/(?:Phone|Contact|Mobile|Tel|Number):\s*[^|\n,;]+[|\n,;]?/gi, "")
      .replace(/^[|\s,;]+|[|\s,;]+$/g, "")
      .trim();
  }

  return {
    name: extractedName || defaultName,
    phone: extractedPhone || defaultPhone,
    street: "",
    cityVillage: "",
    state: "",
    zipCode: "",
    formattedAddress: addressBody || trimmed,
  };
}

/**
 * Creates a structured JSON string containing all customer and address fields
 * to be stored in the orders table's address column.
 */
export function formatOrderAddressPayload(data: {
  name: string;
  phone: string;
  street: string;
  cityVillage: string;
  state: string;
  zipCode: string;
}): string {
  const parts = [data.street.trim(), data.cityVillage.trim(), data.state.trim(), data.zipCode.trim()].filter(
    Boolean
  );
  const fullAddress = parts.join(", ");

  return JSON.stringify({
    name: data.name.trim(),
    phone: data.phone.trim(),
    street: data.street.trim(),
    cityVillage: data.cityVillage.trim(),
    state: data.state.trim(),
    zipCode: data.zipCode.trim(),
    formattedAddress: fullAddress,
  });
}
