const Dashboard = () => {
  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welkom bij je marketing platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold text-foreground mb-2">Aan de slag</h3>
          <p className="text-sm text-muted-foreground">
            Gebruik het menu links om je automations, contacten, broadcasts en meer te beheren.
          </p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold text-foreground mb-2">Overzicht</h3>
          <p className="text-sm text-muted-foreground">
            Voeg je bedrijfsinformatie toe via de instellingen om aan de slag te gaan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
