describe('parseArgs', () => {
  it('should recognize --token as string');
  it('should recognize -t as an alias for --token');
  it('should recognize --no-code');
  it('should default to --no-code being true');
  it('should recognize --pretty');
  it('should recongize -p as an alias for --pretty');
  it('should default to --pretty being true');
  it('should recongize --summary');
  it('should recongize -s as an alias for --summary');
  it('should default to summary being false');
  it('should recognize all URLs');
});
