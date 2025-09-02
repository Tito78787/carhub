const { useState, useEffect } = React;

function CarFilter() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    brand: '',
    min_price: '',
    max_price: '',
    search: '',
  });
  const [limit, setLimit] = useState(6); // 👈 show 6 initially

  useEffect(() => {
    fetchCars();
  }, [filters]);

  function fetchCars() {
    const params = new URLSearchParams(filters); // 👈 no limit in API
    fetch(`/api/cars/?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setCars(data);
        setLimit(3); // 👈 reset when filters change
      });
  }

  return (
    <div>
      {/* Filter Controls */}
      <div className="d-flex gap-2 mb-4">
        <input
          className="form-control"
          placeholder="Search model..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Brand"
          value={filters.brand}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Min Price"
          value={filters.min_price}
          onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Max Price"
          value={filters.max_price}
          onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
        />
      </div>

      {/* Cars Grid */}
      <div className="row">
        {cars.slice(0, limit).map((car) => (
          <div key={car.id} className="col-md-4 mb-4 d-flex">
            <div
              className="card w-100 shadow-sm border-0"
              style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ height: "250px", overflow: "hidden" }}>
                <img
                  src={car.image}
                  className="card-img-top h-100 w-100"
                  style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                  alt={car.make}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{car.make} {car.model}</h5>
                <p className="card-text">Ksh {car.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {limit < cars.length && (
        <div className="text-center mt-3">
          <button
            className="btn btn-primary"
            onClick={() => setLimit(limit + 6)} // 👈 show 6 more each click
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("car-filter-root")).render(<CarFilter />);
