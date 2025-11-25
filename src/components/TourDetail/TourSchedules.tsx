import { ActivitySchedule } from "../../types/activitySchedule";

interface TourSchedulesProps {
  schedules?: ActivitySchedule[];
}

const TourSchedules = ({ schedules }: TourSchedulesProps) => {
  const safeParse = (val?: string | null): Date | null => {
    if (!val) return null;

    let s = String(val);
    if (s.includes(" ") && !s.includes("T")) s = s.replace(" ", "T");

    const d = new Date(s);
    if (isNaN(d.getTime())) {
      return null;
    }
    return d;
  };

  const upcomingSchedules = schedules?.filter((schedule) => {
    if (!schedule.date) return false;

    const scheduleDate = new Date(schedule.date);
    if (isNaN(scheduleDate.getTime())) return false;

    const scheduleDay = new Date(scheduleDate);
    scheduleDay.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return scheduleDay.getTime() >= today.getTime();
  });

  if (!upcomingSchedules || upcomingSchedules.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Lịch khởi hành</h2>
        <p className="text-gray-500">Hiện không có lịch khởi hành sắp tới.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Lịch khởi hành sắp tới</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left border-b">Ngày khởi hành</th>
              <th className="py-3 px-4 text-left border-b">Thời gian bắt đầu</th>
              <th className="py-3 px-4 text-left border-b">Chỗ trống</th>
            </tr>
          </thead>
          <tbody>
            {upcomingSchedules.map((schedule) => {
              let startDate = safeParse(schedule.startTime ?? undefined);
              let endDate = safeParse(schedule.endTime ?? undefined);

              if (!startDate && schedule.date && schedule.timeSlot) {
                const candidate = `${schedule.date.split("T")[0]}T${schedule.timeSlot}`;
                startDate = safeParse(candidate);
              }

              if (!endDate && startDate && schedule.activity?.duration) {
                const durHours = Number(schedule.activity.duration) || 0;
                endDate = new Date(startDate.getTime() + durHours * 60 * 60 * 1000);
              }

              const formatTime = (d: Date | null) => {
                if (!d || isNaN(d.getTime())) return "—";
                return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Bangkok" });
              };

              return (
                <tr key={schedule.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {(() => {
                      const d = safeParse(schedule.startTime ?? schedule.date);
                      if (d && !isNaN(d.getTime())) {
                        return d.toLocaleDateString("vi-VN", { timeZone: "Asia/Bangkok" });
                      }
                      if (schedule.date) {
                        try {
                          const dd = new Date(schedule.date);
                          if (!isNaN(dd.getTime())) return dd.toLocaleDateString("vi-VN", { timeZone: "Asia/Bangkok" });
                        } catch {}
                      }
                      return "—";
                    })()}
                  </td>

                  <td className="py-3 px-4">
                    {formatTime(startDate)}
                  </td>

                  <td className="py-3 px-4">
                    {Number(schedule.availableSpots) - Number(schedule.bookedSpots || 0)} / {schedule.availableSpots}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TourSchedules;
