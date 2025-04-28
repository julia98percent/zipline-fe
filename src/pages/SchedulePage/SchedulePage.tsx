import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg, DatesSetArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import CreateModal, { FormData } from "@components/CreateModal/CreateModal";
import apiClient from "@apis/apiClient";
import PageHeader from "@components/PageHeader/PageHeader";

interface Schedule {
  uid: number;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  customerUid: number | null;
  customerName: string | null;
}

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [includeTime, setIncludeTime] = useState(false);
  const [customers, setCustomers] = useState<
    Array<{ uid: number; name: string }>
  >([
    { uid: 1, name: "김지원" },
    { uid: 2, name: "이민수" },
    { uid: 3, name: "박서연" },
    // 실제로는 API에서 받아와야 합니다
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    uid: number;
    name: string;
  } | null>(
    selectedSchedule?.customerUid
      ? {
          uid: selectedSchedule.customerUid,
          name: selectedSchedule.customerName || "",
        }
      : null
  );

  const fetchSchedules = (startDate: string, endDate: string) => {
    setIsLoading(true);
    apiClient
      .get(`/schedules?startDate=${startDate}&endDate=${endDate}`)
      .then((res) => {
        setSchedules(res.data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // 초기 로드 시 현재 달의 첫날과 마지막날을 기준으로 일정을 가져옴
    const startOfMonth = dayjs().startOf("month").toISOString();
    const endOfMonth = dayjs().endOf("month").toISOString();
    fetchSchedules(startOfMonth, endOfMonth);
  }, []);

  const handleDatesSet = (arg: DatesSetArg) => {
    const start = dayjs(arg.start).toISOString();
    const end = dayjs(arg.end).subtract(1, "day").toISOString();
    console.log(start, end);
    fetchSchedules(start, end);
  };

  const handleAddSchedule = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleScheduleClick = (clickInfo: EventClickArg) => {
    const schedule = schedules.find(
      (s) => s.uid === parseInt(clickInfo.event.id)
    );
    if (schedule) {
      setSelectedSchedule(schedule);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.uid !== id));
    handleCloseDetailModal();
  };

  const handleSubmitSchedule = (formData: FormData) => {
    const newScheduleWithId: Schedule = {
      uid: Math.floor(Math.random() * 1000000),
      title: formData.schedule.title,
      description: formData.schedule.description || null,
      startDate: `${formData.schedule.date}T${formData.schedule.time}:00`,
      endDate: `${formData.schedule.date}T${formData.schedule.time}:00`,
      customerUid: null,
      customerName: null,
    };
    setSchedules((prev) => [...prev, newScheduleWithId]);
  };

  const handleCustomerChange = (event: SelectChangeEvent<number>) => {
    setSelectedCustomer(event.target.value as number);
  };

  // 고객 ID별 색상 매핑
  const getCustomerColor = (customerId: number) => {
    const colors = [
      { bg: "rgba(25, 118, 210, 0.8)", border: "#1565C0" }, // 파랑
      { bg: "rgba(56, 142, 60, 0.8)", border: "#2E7D32" }, // 초록
      { bg: "rgba(211, 47, 47, 0.8)", border: "#B71C1C" }, // 빨강
      { bg: "rgba(123, 31, 162, 0.8)", border: "#6A1B9A" }, // 보라
      { bg: "rgba(245, 124, 0, 0.8)", border: "#E65100" }, // 주황
      { bg: "rgba(0, 151, 167, 0.8)", border: "#00838F" }, // 청록
      { bg: "rgba(158, 157, 36, 0.8)", border: "#827717" }, // 올리브
      { bg: "rgba(136, 14, 79, 0.8)", border: "#880E4F" }, // 자주
    ];

    // customerId를 colors 배열의 인덱스로 매핑
    const colorIndex = (customerId - 1) % colors.length;
    return colors[colorIndex];
  };

  const calendarEvents: EventInput[] = schedules.map((schedule) => {
    const customerColor = getCustomerColor(schedule.customerUid || 0);
    return {
      id: schedule.uid.toString(),
      title: `${schedule.title} - ${schedule.customerName}`,
      start: schedule.startDate,
      end: schedule.endDate,
      backgroundColor: customerColor.bg,
      borderColor: customerColor.border,
      textColor: "#FFFFFF",
      extendedProps: {
        description: schedule.description,
        customerName: schedule.customerName,
        startTime: dayjs(schedule.startDate).format("HH:mm"),
      },
    };
  });

  console.log("Calendar events:", calendarEvents);

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        ml: "240px",
        width: "calc(100% - 240px)",
        minHeight: "100vh",
        backgroundColor: "#F8F9FA",
      }}
    >
      <PageHeader title="일정" userName="사용자 이름" />

      <Box sx={{ display: "flex", justifyContent: "flex-end", px: 3, mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSchedule}
          sx={{
            backgroundColor: "#164F9E",
            "&:hover": {
              backgroundColor: "#0D3B7A",
            },
          }}
        >
          일정 추가
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mx: 3,
          mt: 3,
          border: "1px solid #E0E0E0",
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          "& .fc": {
            fontFamily: "Pretendard, sans-serif",
            "--fc-border-color": "#E0E0E0",
            "--fc-button-text-color": "#164F9E",
            "--fc-button-bg-color": "#FFFFFF",
            "--fc-button-border-color": "#164F9E",
            "--fc-button-hover-bg-color": "#164F9E",
            "--fc-button-hover-border-color": "#164F9E",
            "--fc-button-active-bg-color": "#164F9E",
            "--fc-button-active-border-color": "#164F9E",
            "--fc-more-link-text-color": "#666666",
            "--fc-more-link-bg-color": "transparent",
          },
          "& .fc-toolbar": {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "24px !important",
          },
          "& .fc-toolbar-chunk": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "& .fc-button-group": {
            backgroundColor: "#F8F9FA",
            padding: "4px",
            borderRadius: "8px",
            gap: "2px",
            "& + .fc-button-group": {
              marginLeft: "16px",
            },
          },
          "& .fc-button": {
            textTransform: "none",
            padding: "6px 12px",
            fontWeight: 500,
            backgroundColor: "transparent",
            border: "none",
            color: "#666666",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "#FFFFFF",
              color: "#164F9E",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
            "&:focus": {
              boxShadow: "none",
            },
            "&.fc-button-active": {
              backgroundColor: "#FFFFFF",
              color: "#164F9E",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
          },
          "& .fc-prevYear-button, & .fc-nextYear-button": {
            padding: "6px 10px",
            "& .fc-icon": {
              fontSize: "1.2em",
            },
          },
          "& .fc-prev-button, & .fc-next-button": {
            padding: "6px 10px",
            "& .fc-icon": {
              fontSize: "1.2em",
            },
          },
          "& .fc-toolbar-title": {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#164F9E",
            margin: "0 24px",
            minWidth: "180px",
            textAlign: "center",
          },
          "& .fc-view-harness": {
            minHeight: "600px !important",
          },
          "& .fc-daygrid-day": {
            position: "relative",
            "&::before": {
              content: '""',
              display: "block",
              paddingTop: "80%",
            },
          },
          "& .fc-day-other": {
            backgroundColor: "#F8F9FA",
            "& .fc-daygrid-day-top": {
              opacity: 0.5,
            },
          },
          "& .fc-daygrid-day-frame": {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
          },
          "& .fc-daygrid-day-top": {
            padding: "0",
            flex: "0 0 auto",
          },
          "& .fc-daygrid-day-events": {
            padding: "0 2px",
            flex: 1,
            minHeight: 0,
            marginTop: "-6px",
            paddingTop: "0",
          },
          "& .fc-daygrid-day-bottom": {
            padding: "0",
            flex: "0 0 auto",
          },
          "& .fc .fc-button": {
            padding: "4px 8px",
            fontSize: "1rem",
            backgroundColor: "transparent",
            border: "none",
            color: "#666666",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "transparent",
              color: "#164F9E",
              transform: "scale(1.1)",
            },
            "&:focus": {
              boxShadow: "none",
            },
            "&.fc-button-active": {
              backgroundColor: "transparent",
              color: "#164F9E",
            },
          },
          "& .fc .fc-toolbar-title": {
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "#164F9E",
            margin: "0 12px",
            minWidth: "140px",
            textAlign: "center",
          },
          "& .fc .fc-day": {
            fontSize: "1.1rem",
          },
          "& .fc .fc-event": {
            padding: "1px 2px",
            fontSize: "0.9rem",
            minHeight: "20px",
            marginBottom: "0",
          },
          "& .fc .fc-daygrid-more-link": {
            fontSize: "0.9rem",
            fontWeight: 500,
            padding: "2px 4px",
            margin: "0 4px",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#F8F9FA",
              color: "#164F9E",
              textDecoration: "none",
            },
          },
          "& .fc-more-popover": {
            transform: "translateY(-20px)",
          },
          "& .fc-popover": {
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxHeight: "400px",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          },
          "& .fc-popover-header": {
            padding: "8px 12px",
            backgroundColor: "#F8F9FA",
            borderBottom: "1px solid #E0E0E0",
            flex: "0 0 auto",
          },
          "& .fc-popover-body": {
            padding: "8px",
            overflowY: "auto",
            maxHeight: "calc(400px - 41px)", // 전체 높이에서 헤더 높이를 뺀 값
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
              "&:hover": {
                background: "#555",
              },
            },
          },
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          eventClick={handleScheduleClick}
          datesSet={handleDatesSet}
          headerToolbar={{
            left: "",
            center: "prevYear prev title next nextYear",
            right: "",
          }}
          buttonIcons={{
            prevYear: "chevrons-left",
            nextYear: "chevrons-right",
            prev: "chevron-left",
            next: "chevron-right",
          }}
          height="auto"
          locale={koLocale}
          dayMaxEvents={4}
          moreLinkContent={({ num }) => `+${num}개 더보기`}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          initialDate={dayjs().format("YYYY-MM-DD")}
          fixedWeekCount={false}
          showNonCurrentDates={true}
          eventDisplay="block"
          eventMinHeight={14}
          eventTextColor="#FFFFFF"
          eventBackgroundColor="rgba(25, 118, 210, 0.8)"
          eventBorderColor="#1565C0"
          dayCellDidMount={(arg) => {
            const cell = arg.el;
            const width = cell.offsetWidth;
            cell.style.height = `${width}px`;
          }}
        />
      </Paper>

      <CreateModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitSchedule}
        initialTab={3}
      />

      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            zIndex: 1100,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#000000",
            p: "24px 24px 16px 24px",
          }}
        >
          일정 상세 조회
        </DialogTitle>
        <DialogContent sx={{ p: "0 24px" }}>
          {selectedSchedule && (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#666666",
                    mb: "4px",
                  }}
                >
                  제목
                </Typography>
                <TextField
                  fullWidth
                  value={selectedSchedule.title}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF",
                      "& fieldset": {
                        borderColor: "#E0E0E0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#164F9E",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#164F9E",
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeTime}
                      onChange={(e) => setIncludeTime(e.target.checked)}
                      sx={{
                        color: "#164F9E",
                        "&.Mui-checked": {
                          color: "#164F9E",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "14px", color: "#666666" }}>
                      시간 포함
                    </Typography>
                  }
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#666666",
                      mb: "4px",
                    }}
                  >
                    시작 날짜
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    value={dayjs(selectedSchedule.startDate).format(
                      "YYYY-MM-DD"
                    )}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FFFFFF",
                        "& fieldset": {
                          borderColor: "#E0E0E0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#164F9E",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#164F9E",
                        },
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: includeTime ? "#666666" : "#999999",
                      mb: "4px",
                    }}
                  >
                    시작 시간
                  </Typography>
                  <TextField
                    fullWidth
                    type="time"
                    disabled={!includeTime}
                    value={dayjs(selectedSchedule.startDate).format("HH:mm")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FFFFFF",
                        "& fieldset": {
                          borderColor: "#E0E0E0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#164F9E",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#164F9E",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "#F8F9FA",
                          "& fieldset": {
                            borderColor: "#E0E0E0",
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#666666",
                      mb: "4px",
                    }}
                  >
                    종료 날짜
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    value={dayjs(selectedSchedule.endDate).format("YYYY-MM-DD")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FFFFFF",
                        "& fieldset": {
                          borderColor: "#E0E0E0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#164F9E",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#164F9E",
                        },
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: includeTime ? "#666666" : "#999999",
                      mb: "4px",
                    }}
                  >
                    종료 시간
                  </Typography>
                  <TextField
                    fullWidth
                    type="time"
                    disabled={!includeTime}
                    value={dayjs(selectedSchedule.endDate).format("HH:mm")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FFFFFF",
                        "& fieldset": {
                          borderColor: "#E0E0E0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#164F9E",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#164F9E",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "#F8F9FA",
                          "& fieldset": {
                            borderColor: "#E0E0E0",
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#666666",
                    mb: "4px",
                  }}
                >
                  고객
                </Typography>
                <Autocomplete
                  fullWidth
                  options={customers}
                  value={selectedCustomer}
                  onChange={(_, newValue) => {
                    setSelectedCustomer(newValue);
                  }}
                  getOptionLabel={(option) => `${option.name} (${option.uid})`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="고객명 또는 ID를 입력하세요"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFFFFF",
                          "& fieldset": {
                            borderColor: "#E0E0E0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#164F9E",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#164F9E",
                          },
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography>
                        {option.name} ({option.uid})
                      </Typography>
                    </li>
                  )}
                  filterOptions={(options, { inputValue }) => {
                    const searchValue = inputValue.toLowerCase();
                    return options.filter(
                      (option) =>
                        option.name.toLowerCase().includes(searchValue) ||
                        option.uid.toString().includes(searchValue)
                    );
                  }}
                />
              </Box>

              <Box sx={{ mb: 0 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#666666",
                    mb: "4px",
                  }}
                >
                  세부사항
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={selectedSchedule.description || ""}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF",
                      "& fieldset": {
                        borderColor: "#E0E0E0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#164F9E",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#164F9E",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px 24px", gap: 1 }}>
          <Button
            onClick={handleCloseDetailModal}
            variant="outlined"
            sx={{
              borderColor: "#164F9E",
              color: "#164F9E",
              "&:hover": {
                borderColor: "#0D3B7A",
                backgroundColor: "transparent",
              },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleCloseDetailModal}
            variant="contained"
            sx={{
              backgroundColor: "#164F9E",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#0D3B7A",
              },
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchedulePage;
