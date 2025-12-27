type RegionProps = {
  name: string;
  children: React.ReactNode;
};

export const Region = ({ name, children }: RegionProps) => {
  return (
    <>
      {`//#region ${name}`}
      {children}
      {`//#endregion`}
    </>
  );
};
