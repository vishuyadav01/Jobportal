const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-sm text-slate-500 font-medium">{text}</p>
    </div>
  );
};

export default Loader;
