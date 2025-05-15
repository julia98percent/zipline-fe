            {!contractInfo || contractInfo?.contractUid === null ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                }}
              >
                <Typography color="text.secondary">
                  첨부 문서 없음
                </Typography>
              </Box>
            ) : ( 