const API_URL = "https://localhost:54893/api/Reservation";

export const getReservationsService = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error fetching reservations");

    const data = await response.json();

    // La API devuelve { result: [], success, message }
    return data.result;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
};

export const createReservationService = async (reservation) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    });

    if (!response.ok) throw new Error("Error creating reservation");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

export const updateReservationService = async (id, reservation) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    });

    if (!response.ok) throw new Error("Error updating reservation");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }
};


export const deleteReservationService = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error deleting reservation");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw error;
  }
};
