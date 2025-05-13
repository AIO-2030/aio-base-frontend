
const CommunitySection = () => {
  return (
    <section className="bg-white/80 rounded-xl border border-border/40 p-8 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Join the Community</h2>
          <p className="text-muted-foreground mb-6">
            Connect with developers, share ideas, and contribute to innovative open-source projects 
            that are shaping the future of technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Join Discord
            </button>
            <button className="bg-secondary text-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
              GitHub
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-gradient-to-r from-primary/10 to-primary/5 h-48 rounded-lg"></div>
      </div>
    </section>
  );
};

export default CommunitySection;
