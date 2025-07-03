import {
  Box,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@components/Button";
import { QuestionType } from "@apis/preCounselService";

interface Props {
  question: QuestionType;
  handleChoiceChange: (
    questionIndex: number,
    choiceIndex: number,
    value: string
  ) => void;
  handleAddChoice: (questionIndex: number) => void;
  handleDeleteChoice: (questionIndex: number, choiceIndex: number) => void;
  questionIndex: number;
}

function SingleChoiceAdd({
  question,
  handleChoiceChange,
  handleAddChoice,
  handleDeleteChoice,
  questionIndex,
}: Props) {
  return (
    <Box sx={{ width: "100%", maxWidth: "600px" }}>
      <FormControl fullWidth>
        <Typography sx={{ mb: 2, color: "#164F9E", fontWeight: 500 }}>
          단일 선택 옵션
        </Typography>
        <RadioGroup>
          {question.choices?.map((choice, choiceIndex) => (
            <Box
              key={choiceIndex}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 1,
              }}
            >
              <FormControlLabel
                sx={{
                  width: "100%",
                  "& span:nth-of-type(2)": {
                    width: "100%",
                  },
                }}
                value={choice.text}
                control={<Radio disabled />}
                label={
                  <TextField
                    fullWidth
                    sx={{ mb: 1 }}
                    value={choice.text}
                    onChange={(event) =>
                      handleChoiceChange(
                        questionIndex,
                        choiceIndex,
                        event.target.value
                      )
                    }
                    placeholder="선택지 내용을 입력하세요"
                  />
                }
              />
              <IconButton
                onClick={() => handleDeleteChoice(questionIndex, choiceIndex)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </RadioGroup>
        <Button
          text="선택지 추가"
          variant="outlined"
          onClick={() => {
            handleAddChoice(questionIndex);
          }}
        />
      </FormControl>
    </Box>
  );
}

export default SingleChoiceAdd;
