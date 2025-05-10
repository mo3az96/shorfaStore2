$(function () {
  const timeSlots = {
    Sunday: ["01:00 am - 02:00 am", "01:00 pm - 02:00 pm"],
    Monday: ["03:00 am - 04:00 am", "03:00 pm - 04:00 pm"],
    Tuesday: ["05:00 am - 06:00 am", "05:00 pm - 06:00 pm"],
    Wednesday: ["07:00 am - 08:00 am", "07:00 pm - 08:00 pm"],
    Thursday: ["09:00 am - 10:00 am", "09:00 pm - 10:00 pm"],
  };
  const disabledDates = ["2024-09-25", "2024-10-01", "2024-10-02"];
  const selected = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendar = new FullCalendar.Calendar(
    document.getElementById("calendar"),
    {
      headerToolbar: {
        left: "",
        center: "prev,title,next",
        right: "",
      },
      initialDate: today,
      selectable: true,
      locale: "ar",
      direction: "rtl",
      validRange: { start: today },
      dayCellDidMount: function (info) {
        const d = info.date;
        const f = d.toISOString().split("T")[0];
        if ([4, 5].includes(d.getUTCDay()) || disabledDates.includes(f)) {
          $(info.el)
            .addClass("fc-day-disabled")
            .css({ background: "#ffb7b7", pointerEvents: "none" });
        }
      },
      select: function (arg) {
        const d = new Date(arg.start);
        const day = d.toLocaleString("en-US", { weekday: "long" });
        const f = d.toISOString().split("T")[0];
        if (disabledDates.includes(f)) return;

        const $time = $("#time-container").empty().show();
        const $selected = $("#time_date-container").show();
        const slots = timeSlots[day] || [];
        const checked = selected[f] || [];

        slots.forEach((slot, i) => {
          const id = `p_${i}`;
          $(`<li>
          <input type="checkbox" id="${id}" value="${slot}" class="slot-checkbox" ${
            checked.includes(slot) ? "checked" : ""
          }>
          <label for="${id}" class="slot-label">${slot}</label>
        </li>`)
            .appendTo($time)
            .find("input")
            .on("change", function () {
              const $cb = $(this);
              const exists = $selected.find(
                `p[data-slot="${slot}"][data-date="${f}"]`
              );
              if ($cb.is(":checked")) {
                if (!exists.length) {
                  $(`<div class="time-block">
                <p data-slot="${slot}" data-date="${f}">${slot} - ${f}</p>
                <button class="delete-event"><span class="fas fa-times"></span></button>
              </div>`)
                    .appendTo($selected)
                    .find(".delete-event")
                    .on("click", function () {
                      $(this).parent().remove();
                      $cb.prop("checked", false);
                      selected[f] = (selected[f] || []).filter(
                        (s) => s !== slot
                      );
                      if (!$selected.children().length) $selected.hide();
                      if (!$time.find("input:checked").length) $time.hide();
                    });
                  selected[f] = selected[f] || [];
                  selected[f].push(slot);
                }
              } else {
                exists.parent().remove();
                selected[f] = (selected[f] || []).filter((s) => s !== slot);
                if (!$selected.children().length) $selected.hide();
                if (!$time.find("input:checked").length) $time.hide();
              }
            });
        });

        if (!slots.length) $time.hide();
      },
    }
  );

  calendar.render();
});
