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
    <Box className="w-full max-w-xl">
      <FormControl fullWidth>
        <Typography className="mb-4 font-medium text-primary">
          단일 선택 옵션
        </Typography>
        <RadioGroup>
          {question.choices?.map((choice, choiceIndex) => (
            <Box key={choiceIndex} className="flex items-center gap-4 mb-2">
              <FormControlLabel
                className="w-full"
                sx={{
                  "& span:nth-of-type(2)": {
                    width: "100%",
                  },
                }}
                value={choice.text}
                control={<Radio disabled />}
                label={
                  <TextField
                    fullWidth
                    className="mb-2"
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
          onClick={() => {
            handleAddChoice(questionIndex);
          }}
        >
          선택지 추가
        </Button>
      </FormControl>
    </Box>
  );
}

export default SingleChoiceAdd;
