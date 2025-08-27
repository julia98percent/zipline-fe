import {
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded";
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

function MultipleChoiceAdd({
  question,
  handleChoiceChange,
  handleAddChoice,
  handleDeleteChoice,
  questionIndex,
}: Props) {
  return (
    <div className="w-full">
      <p className="mb-4 font-medium" text-primary>
        다중 선택 옵션
      </p>
      {question.choices?.map((choice, choiceIndex) => (
        <div key={choiceIndex} className="flex items-center mb-2 w-full">
          <FormControlLabel
            className="w-full"
            sx={{
              "& span:nth-of-type(2)": {
                width: "100%",
              },
            }}
            control={<Checkbox disabled />}
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
            <DeleteIcon className="text-red-600" />
          </IconButton>
        </div>
      ))}
      <Button
        fullWidth
        variant="outlined"
        onClick={() => handleAddChoice(questionIndex)}
      >
        선택지 추가
      </Button>
    </div>
  );
}

export default MultipleChoiceAdd;
