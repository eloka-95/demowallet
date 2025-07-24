export default function AdminCard({ title, children }) {
    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h3 className="admin-card-title">{title}</h3>
            </div>
            <div className="admin-card-body">
                {children}
            </div>
        </div>
    );
  }