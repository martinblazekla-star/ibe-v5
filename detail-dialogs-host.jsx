// Hub component that listens to global events and mounts detail dialogs
// Apps include <DetailDialogsHost onPickRoomRate={...} /> at root level

function DetailDialogsHost({ onPickRoomRate }) {
  const [room, setRoom] = React.useState(null);
  const [pkg, setPkg] = React.useState(null);
  const [wellness, setWellness] = React.useState(null);

  React.useEffect(() => {
    const onRoom = (e) => setRoom(e.detail?.room || null);
    const onPkg = (e) => setPkg(e.detail?.pkg || null);
    const onWellness = (e) => setWellness(e.detail?.procedure || null);
    window.addEventListener("open-room-detail", onRoom);
    window.addEventListener("open-package-detail", onPkg);
    window.addEventListener("open-wellness-detail", onWellness);
    return () => {
      window.removeEventListener("open-room-detail", onRoom);
      window.removeEventListener("open-package-detail", onPkg);
      window.removeEventListener("open-wellness-detail", onWellness);
    };
  }, []);

  return (
    <>
      {window.RoomDetailDialog && (
        <window.RoomDetailDialog
          open={!!room}
          room={room}
          onClose={() => setRoom(null)}
          onPickRate={(r, rate) => {
            setRoom(null);
            onPickRoomRate && onPickRoomRate(r, rate);
          }}
        />
      )}
      {window.PackageDetailDialog && (
        <window.PackageDetailDialog
          open={!!pkg}
          pkg={pkg}
          onClose={() => setPkg(null)}
        />
      )}
      {window.WellnessDetailDialog && (
        <window.WellnessDetailDialog
          open={!!wellness}
          procedure={wellness}
          onClose={() => setWellness(null)}
        />
      )}
    </>
  );
}

window.DetailDialogsHost = DetailDialogsHost;
