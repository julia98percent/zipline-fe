import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Button from "@components/Button";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
interface Props {
  open: boolean;
  onLoginRedirect: () => void;
}

const SessionExpiredModal = ({ open, onLoginRedirect }: Props) => (
  <Dialog open={open} disableEscapeKeyDown className="p-8">
    <DialogContent>
      <div className="flex gap-2 items-center mb-2 ">
        <WarningAmberIcon className="text-yellow-600" />
        <h6 className="text-lg font-bold">세션이 만료되었습니다</h6>
      </div>
      <p>보안을 위해 자동으로 로그아웃되었습니다.</p>
      <p>다시 로그인해주세요.</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={onLoginRedirect} variant="contained">
        로그인 페이지로 이동
      </Button>
    </DialogActions>
  </Dialog>
);

export default SessionExpiredModal;
