import {
  MapPin,
  User,
  Phone,
  Mail,
  Home,
} from "lucide-react";

function AddressForm({ address, setAddress }) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((currentAddress) => ({
      ...currentAddress,
      [name]: value,
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
          <MapPin
            size={20}
            className="text-indigo-600"
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Delivery Address
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter the address where you want your order
            delivered.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">

        {/* Full Name */}
        <div className="sm:col-span-2">
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Full Name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={address.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                py-2.5
                pl-10
                pr-3
                text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-100
              "
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Phone Number
          </label>

          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="phone"
              name="phone"
              type="tel"
              value={address.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                py-2.5
                pl-10
                pr-3
                text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-100
              "
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="email"
              name="email"
              type="email"
              value={address.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                py-2.5
                pl-10
                pr-3
                text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-100
              "
            />
          </div>
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label
            htmlFor="address"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Address
          </label>

          <div className="relative">
            <Home
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <textarea
              id="address"
              name="address"
              rows="3"
              value={address.address}
              onChange={handleChange}
              placeholder="House number, street, area"
              required
              className="
                w-full
                resize-none
                rounded-lg
                border
                border-slate-200
                bg-white
                py-2.5
                pl-10
                pr-3
                text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-100
              "
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            City
          </label>

          <input
            id="city"
            name="city"
            type="text"
            value={address.city}
            onChange={handleChange}
            placeholder="Enter city"
            required
            className="
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              py-2.5
              text-sm
              text-slate-800
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-100
            "
          />
        </div>

        {/* State */}
        <div>
          <label
            htmlFor="state"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            State
          </label>

          <input
            id="state"
            name="state"
            type="text"
            value={address.state}
            onChange={handleChange}
            placeholder="Enter state"
            required
            className="
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              py-2.5
              text-sm
              text-slate-800
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-100
            "
          />
        </div>

        {/* Pincode */}
        <div>
          <label
            htmlFor="pincode"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Pincode
          </label>

          <input
            id="pincode"
            name="pincode"
            type="text"
            inputMode="numeric"
            maxLength="6"
            value={address.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            required
            className="
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              py-2.5
              text-sm
              text-slate-800
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-100
            "
          />
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Country
          </label>

          <input
            id="country"
            name="country"
            type="text"
            value={address.country}
            onChange={handleChange}
            placeholder="Enter country"
            required
            className="
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              py-2.5
              text-sm
              text-slate-800
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-100
            "
          />
        </div>
      </div>
    </div>
  );
}

export default AddressForm;