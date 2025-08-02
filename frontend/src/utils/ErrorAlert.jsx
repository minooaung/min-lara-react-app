export default function ErrorAlert({ error }) {
  if (!error) return null;

  const renderError = () => {
    if (typeof error === "string") {
      return <p className="text-sm font-medium text-red-800">{error}</p>;
    }

    if (typeof error === "object") {
      return Object.keys(error).map((key) => (
        <p key={key} className="text-sm font-medium text-red-800">
          {Array.isArray(error[key]) ? error[key][0] : error[key]}
        </p>
      ));
    }

    return null;
  };

  return (
    <div className="rounded-md bg-red-100 p-4 mb-4">
      <div className="flex">
        <div className="ml-3">{renderError()}</div>
      </div>
    </div>
  );
}
